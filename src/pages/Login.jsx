import { useState } from 'react'; 
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'; 
import { auth } from '../firebase'; 
import { toast } from 'react-toastify';  

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  
  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Account created successfully!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Logged in successfully!');
      }
      setIsAuthenticated(true);
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  // Background image styles applied to the main container
  const backgroundStyle = {
    backgroundImage: "url('/bg.jpg')", // Replace with your image path
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  };
  
  return (
    <div className="flex items-center justify-center h-screen" style={backgroundStyle}>
      <div className="flex flex-col items-center w-full max-w-md">
        {/* Login/Signup Container */}
        <div className="bg-white p-8 rounded-lg shadow-lg w-3/4 ">
          {/* Logo moved inside the container */}
          <div className="flex justify-center mb-1">
            <img
              src="/po.png" // Updated path without "public/"
              alt="Company Logo"
              className="h-20 w-auto"
            />
          </div>
          
          {/* <h2 className="text-2xl font-normal mb-6 text-center">{isSignUp ? 'Sign Up' : 'Login'}</h2> */}
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
            >
              {isSignUp ? 'Sign Up' : 'Login'}
            </button>
            <p className="text-center text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                className="text-indigo-600 hover:underline"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? 'Login' : 'Sign Up'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;