import { useAuth } from "@/context/AuthContext";

const HomePage = () => {
  const {token}=useAuth()
  console.log("token",token)
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">Welcome to Eventify</h1>
        <p className="mt-4">Create and manage your events with ease.</p>
      </div>
    );
}

export default HomePage;