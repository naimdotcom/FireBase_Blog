"use client";
import { Envelope, FacebookLogo, GoogleLogo, Lock, User } from "phosphor-react";
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
import { UploadImageModal } from "./UploadImageModal";
import { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { getDatabase, set, ref, update } from "firebase/database";

export const SignUpCard = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
  });
  const auth = getAuth();
  const db = getDatabase();
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  // todo: handle user info on change of input value
  const handleUserInfo = (e) => {
    const { id, value } = e.target;
    setUserInfo({ ...userInfo, [id]: value });
  };

  // todo: handle google sign up
  const handleSignUpWithGoogle = () => {
    signInWithPopup(auth, provider).then((userCredential) => {
      const user = userCredential.user;
      console.log("usercredential in signup", userCredential);
      if (!user) {
        throw new Error("User object is undefined");
      }
      const dbRef = ref(db, `users/${user.uid}`);

      // Store user data in Realtime Database
      updateProfile(auth.currentUser, {
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
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
          navigate("/login");
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

  // todo: handle sign up
  const handleSignUp = (e) => {
    e.preventDefault();
    const { email, password } = userInfo;
    if (
      !userInfo?.username ||
      !userInfo.email ||
      !userInfo.password ||
      !imageUrl
    ) {
      toast("All fields are required", {
        description: "Please fill all the fields",
      });
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("usercredential in signup", userCredential);
        if (!user) {
          throw new Error("User object is undefined");
        }
        const dbRef = ref(db, `users/${user.uid}`);
        updateProfile(auth.currentUser, {
          displayName: userInfo?.username,
          photoURL: imageUrl ? imageUrl : " ",
        });

        // Store user data in Realtime Database
        return set(dbRef, {
          username: userInfo.username ? userInfo.username : " ",
          email: userInfo.email ? userInfo.email : " ",
          profileImage: imageUrl ? imageUrl : " ",
          createdAt: Date.now(),
          userUid: user?.uid ? user?.uid : " ",
        });
      })

      .then(() => {
        toast("Signed Up", {
          description: `You are signed up as ${userInfo.email} successfully`,
        });
      })
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("error in sign up Process", errorCode, errorMessage);
      });
  };

  // todo:
  return (
    <Card className="max-w-sm">
      <CardContent className="space-y-3">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            If you don&apos;t have any account then just click here
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
            <Label htmlFor="profilePic">Profile Image*</Label>
            <div className="relative">
              <UploadImageModal setImageUrl={setImageUrl} />
            </div>
          </fieldset>
          <fieldset className="space-y-1">
            <Label htmlFor="username">Username*</Label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                className="ps-11"
                onChange={handleUserInfo}
              />
              <InputIcon>
                <User size={19} color="#AFBACA" />
              </InputIcon>
            </div>
          </fieldset>
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
          <Button onClick={handleSignUp} className="!mt-3 block w-full">
            Create Account
          </Button>
        </form>
        <p className="text-center">
          <Link to="/login">Already have an account?</Link>
        </p>
      </CardContent>
    </Card>
  );
};
