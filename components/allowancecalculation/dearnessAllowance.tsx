const calculateDearnessAllowance = (rateOfPay: number): number => {
    return (rateOfPay * 1.3) * (50 / 100);
  };
  
  export default calculateDearnessAllowance;