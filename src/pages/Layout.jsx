import { Outlet } from "react-router-dom";
import Navbar from "./NavBarComponent";
import styled from "styled-components";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  color : black;
`;

export default function Layout() {

  return (
    <PageContainer>
      <Navbar />
      <Outlet /> {/* This renders the current page content */}
    </PageContainer>
  );
}
