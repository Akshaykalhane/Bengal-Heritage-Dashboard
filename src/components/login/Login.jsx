import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Container, Card, Form, Button } from 'react-bootstrap';

import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase-config';
import Header from '../header/Header';
import { toast, ToastContainer } from 'react-toastify';



const Login = () => {
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            navigate('/');
          }
        });
    
        return () => unsubscribe();
      }, [navigate]);

    const handleSubmit = async(e) =>{
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth,email,password)
            navigate("/")
        } catch (error) {
          toast.error("Invalid Credential")
        }
    }
  return (
    <>
    <Header />
    <Container className="vh-100 d-flex justify-content-center align-items-center pb-5">
      <Card className="p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="text-center mb-4">Sign In</h3>
        <Form onSubmit={handleSubmit}>
          {/* Email input */}
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter email" required />
          </Form.Group>

          {/* Password input */}
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" required />
          </Form.Group>

          {/* Submit button */}
          <div className="d-grid">
            <Button style={{backgroundColor:"#eb1c25",fontWeight:"600"}} type="submit">
              LOGIN
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
    <ToastContainer />
    </>
  );
};

export default Login;
