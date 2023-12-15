import { useEffect } from 'react'
import { useState } from 'react'
const DeploymentStatusBar = () => {
  const [color, setColor] = useState<"#a9e37c" | "#FFDD33">("#a9e37c")


  useEffect(() => {
    setColorFn()
    const interval = setInterval(() => {
      setColorFn()
    }, 5000); // 7000 milliseconds = 7 seconds

    return () => clearInterval(interval);
  }, []);


  const setColorFn = () => {
    const updateMoment = localStorage.getItem("updateMoment")
    if (updateMoment) {
      const updateMomentDate = new Date(updateMoment).getTime()
      const now = new Date().getTime()
      const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

      if (now - updateMomentDate > fiveMinutes) {
        setColor("#a9e37c")
      } else {
        setColor("#FFDD33")
      }
    }
  }


  const styles = {
    backgroundColor: color,
    width: "16px",
    height: "16px",
    borderRadius: "50%"
  }

  return (
    <div style={styles}></div>
  )
}

export default DeploymentStatusBar