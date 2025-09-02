import style from "./AuthLayout.module.css";
const AuthLayout = ({ children, info = false, visual }) => {
  return (
    <main className={style.authLayout}>
      <section className={style.formSection}>{children}</section>
      <section className={style.visualsSection}>
        {info && (
          <div className={style.logoSection}>
            <h1 className={style.title}>
              Welcome to <br />
              Inventory Guru
            </h1>
            <img src="/logo.png" alt="logo"/>
          </div>
        )}
        <div className={style.visualWrapper}>
          <img src={visual} alt="auth-hero" className={style.visualImg} />
        </div>
      </section>
    </main>
  );
};

export default AuthLayout;
