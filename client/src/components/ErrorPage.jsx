import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <>
      <h1>HistoCrypt</h1>
      <h2 className="text-danger">404 Page Not Found</h2>
      <p className="text-danger">
        Oops! We are sorry for the inconvenience that this error has caused.
        Please be patient and we will get you back to solving puzzles in no time.
      </p>
      <h3 className="text-danger">Thank you</h3>
      <Link className="btn btn-primary" to="/">
        Home
      </Link>
    </>
  );
}
