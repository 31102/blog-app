import Footer from "./footer/Footer";
import Header from "./header/Header";

interface IProps {
  children: JSX.Element;
}

export function Layout({ children }: IProps) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ flex: 1 }}>{children}</div>
      <Footer />
    </div>
  );
}
