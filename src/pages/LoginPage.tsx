import { useAuth } from "../context/useAuth";

function LoginPage() {
  const { login } = useAuth();

  const handleLoginAdmin = () => {
    const fakeAdminToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtZWxpbmEiLCJyb2xlIjoiQURNSU4iLCJleHAiOjE4OTM0NTYwMDB9.fake";
    login(fakeAdminToken);
  };

  const handleLoginParticipant = () => {
    const fakeParticipantToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtZWxpbmEiLCJyb2xlIjoiUEFSVElDSVBBTlQiLCJleHAiOjE4OTM0NTYwMDB9.fake";
    login(fakeParticipantToken);
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLoginAdmin}>Login Admin</button>
      <button onClick={handleLoginParticipant}>Login Participant</button>
    </div>
  );
}

export default LoginPage;
