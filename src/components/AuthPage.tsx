import Image from "next/image";
import "@/styles/style.css";

export default function AuthPage() {
  return (
    <div className="auth-container">
      {/* Left Section */}
      <div className="auth-left">
        <Image
          src="/twizzle-logo.png"
          alt="Twizzle Logo"
          width={120}
          height={120}
        />
        <h1 className="brand-text">Twizzle</h1>
      </div>

      {/* Right Section */}
      <div className="auth-right">
        <Image
          src="/twizzle-logo.png"
          alt="Twizzle Icon"
          width={40}
          height={40}
          className="small-logo"
        />

        <h1>Happening now</h1>
        <h3>Join Twizzle today</h3>

        <button className="google-btn">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google"
          />
          Sign up with Google
        </button>

        <button className="email-btn">
          Sign up with phone or email
        </button>

        <p className="terms">
          By signing up, you agree to the{" "}
          <span>Terms of Service</span> and{" "}
          <span>Privacy Policy</span>, including{" "}
          <span>Cookie Use</span>.
        </p>

        <p className="login-text">
          Already have an account? <span>Log in</span>
        </p>
      </div>
    </div>
  );
}
