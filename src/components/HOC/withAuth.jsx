import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase-config';
import { useNavigate } from 'react-router-dom';

import { Spinner, Container } from 'react-bootstrap';

const LoadingScreen = () => {
  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-center align-items-center vh-100"
    >
      <Spinner animation="border" role="status" variant="primary" />
      <div className="mt-3 text-muted">Loading...</div>
    </Container>
  );
};

export default function withAuth(WrappedComponent) {
  return (props)=>{
    const [loading,setLoading]=useState(true);
    const [user,setUser]=useState(null);
    const navigate = useNavigate();
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth,(currentUser)=>{
            if(currentUser){
              setUser(currentUser);
            }else{
              navigate("/login");
                // console.log("current user not found")
            }
        })
        setLoading(false);
        return ()=>unsubscribe();
    },[])
    if(loading) return <LoadingScreen />
    return <WrappedComponent {...props} user={user} />
  }
}
