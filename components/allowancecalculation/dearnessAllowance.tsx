const calculateDearnessAllowance = (rateOfPay: number): number => {
    return (rateOfPay * 1.3) * (46 / 100);
  };
  
  export default calculateDearnessAllowance;