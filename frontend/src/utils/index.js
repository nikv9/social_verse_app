export const getUser = () => {
  let idleTimer;
  const resetIdleTimer = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (!localStorage.getItem("tokenId")) {
        alert("hello");
      }
    }, 5000); //5 seconds
  };
  // Reset idle timer on user activity
  const handleUserActivity = () => {
    resetIdleTimer();
  };
  // Event listeners for user activity
  document.addEventListener("mousemove", handleUserActivity);
  document.addEventListener("keypress", handleUserActivity);
  // Initial setup of idle timer
  resetIdleTimer();
};
