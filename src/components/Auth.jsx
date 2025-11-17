import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { LogIn, UserPlus } from 'lucide-react';

export default function Auth({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onLogin();
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('Email tidak ditemukan');
      } else if (err.code === 'auth/wrong-password') {
        setError('Password salah');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Email sudah terdaftar');
      } else if (err.code === 'auth/weak-password') {
        setError('Password minimal 6 karakter');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    
      
        
          💰 Budget Tracker
        
        
          Sync otomatis di semua device
        
        
        
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              isLogin 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            Login
          
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              !isLogin 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            Daftar
          
        

        
          
            
              Email
            
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          

          
            
              Password
            
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            Minimal 6 karakter
          

          {error && (
            
              {error}
            
          )}

          
            {loading ? (
              <>
                
                Loading...
              </>
            ) : isLogin ? (
              <>
                
                Login
              </>
            ) : (
              <>
                
                Daftar Akun Baru
              </>
            )}
          
        

        
          
            💡 Tips: Gunakan email yang sama di laptop & HP untuk sync data
          
        
      
    
  );
}
