import { useRouter } from "next/router";
import { useEffect } from "react";


export default function Home() {

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // Redirect to login if token is null
    }
  }, [router]);
  
  return (
   <>
   </>
  );
}
