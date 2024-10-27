"use client";
import { Envelope, GoogleLogo, Lock } from "phosphor-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Divider,
  Input,
  InputIcon,
  Label,
  toast,
} from "keep-react";
import { Link, useNavigate } from "react-router-dom";

import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { getDatabase, set, ref } from "firebase/database";

export const LoginCard = () => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const db = getDatabase();

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, userInfo.email, userInfo.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
      })
      .then(() => {
        toast("Logged in", {
          description: `You are logged in as ${userInfo.email} successfully`,
        });
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const handleSignUpWithGoogle = () => {
    signInWithPopup(auth, provider).then((userCredential) => {
      const user = userCredential.user;

      if (!user) {
        throw new Error("User object is undefined");
      }
      const dbRef = ref(db, `users/${user.uid}`);

      // Store user data in Realtime Database
      return set(dbRef, {
        username: user.displayName ? user.displayName : "",
        email: user.email ? user.email : "",
        profileImage: user.photoURL ? user.photoURL : "",
        createdAt: Date.now(),
        userUid: user.uid,
      })
        .then(() => {
          toast("Signed Up", {
            description: `You are signed up as ${userInfo.email} successfully`,
          });
          navigate("/");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(
            "error in google sign up Process",
            errorCode,
            errorMessage
          );
        });
    });
  };
  const handleUserInfo = (e) => {
    const { id, value } = e.target;
    setUserInfo({ ...userInfo, [id]: value });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      } else {
        navigate("/login");
      }
    });
  }, [auth]);

  return (
    <Card className="max-w-sm ">
      <CardContent className="space-y-3">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            If you already have any account then just click here
          </CardDescription>
        </CardHeader>
        <div className="flex items-center justify-between gap-3">
          <Button
            variant="outline"
            color="secondary"
            className="w-full"
            onClick={handleSignUpWithGoogle}
          >
            <GoogleLogo size={20} className="mr-1.5" />
            Google
          </Button>
        </div>
        <Divider>Or</Divider>
        <form className="space-y-2">
          <fieldset className="space-y-1">
            <Label htmlFor="email">Email*</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="Enter email"
                className="ps-11"
                onChange={handleUserInfo}
              />
              <InputIcon>
                <Envelope size={19} color="#AFBACA" />
              </InputIcon>
            </div>
          </fieldset>
          <fieldset className="space-y-1">
            <Label htmlFor="password">Password*</Label>
            <div className="relative">
              <Input
                id="password"
                placeholder="Enter password"
                type="password"
                className="ps-11"
                onChange={handleUserInfo}
              />
              <InputIcon>
                <Lock size={19} color="#AFBACA" />
              </InputIcon>
            </div>
          </fieldset>
          <Button
            type="submit"
            className="!mt-3 block w-full"
            onClick={handleLogin}
          >
            Login
          </Button>
        </form>
        <p className="text-center">
          Don't have an account?{" "}
          <Link className="underline" to="/signup">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};
