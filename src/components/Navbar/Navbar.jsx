import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Dropdown,
  DropdownAction,
  DropdownContent,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarCollapseBtn,
  NavbarContainer,
  NavbarItem,
  NavbarList,
} from "keep-react";
import { getDatabase, ref, onValue, get } from "firebase/database";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../../FireBase/firebase";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
export const NavbarComponent = () => {
  const db = getDatabase();
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const getUserData = (userId) => {
    if (!userId) return; // Ensure userId is available
    const starCountRef = ref(db, `users/${userId}`);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setUser(data);
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      console.log("User signed out successfully.");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Fetch user data only after authentication is confirmed
        getUserData(currentUser.uid);
      } else {
        // Redirect to login if not authenticated
        navigate("/login");
      }
    });

    // Cleanup the subscription on component unmount
    return () => unsubscribe();
  }, [auth, navigate]);

  console.log(user);

  return (
    <>
      <Navbar className="">
        <NavbarContainer className="mx-auto">
          <NavLink to="/">
            <NavbarBrand>
              <img src={logo} alt="keep" className="w-14 rounded-md" />
            </NavbarBrand>
          </NavLink>
          <NavbarList>
            <NavLink to="/">
              <NavbarItem>Home</NavbarItem>
            </NavLink>
            <NavLink to="/blog-post">
              <NavbarItem>Post</NavbarItem>
            </NavLink>
            {/* <NavbarItem>
              <NavLink to="/projects">Projects</NavLink>
            </NavbarItem> */}
          </NavbarList>
          <NavbarList>
            <Dropdown placement="bottom-end">
              <DropdownAction asChild>
                <Avatar>
                  <AvatarImage
                    src={user?.profileImage ? user.profileImage : ""}
                  />
                  <AvatarFallback>KR</AvatarFallback>
                </Avatar>
              </DropdownAction>
              <DropdownContent
                align="end"
                className="border border-metal-100 dark:border-metal-800"
              >
                <NavLink to={`/user/${user?.userUid}`}>
                  <DropdownItem>Account</DropdownItem>
                </NavLink>
                <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
              </DropdownContent>
            </Dropdown>
          </NavbarList>
          <NavbarCollapseBtn />
          <NavbarCollapse>
            <NavbarItem>Projects</NavbarItem>
            <NavbarItem>Research</NavbarItem>
            <NavbarItem>Contact</NavbarItem>
            <NavbarItem>Sign In</NavbarItem>
            <NavbarItem active={true}>Sign Up</NavbarItem>
          </NavbarCollapse>
        </NavbarContainer>
      </Navbar>
      <Outlet />
    </>
  );
};
