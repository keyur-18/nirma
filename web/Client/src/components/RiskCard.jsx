function RiskCard({ inverterId, riskScore }) {

  const getColor = () => {
    if (riskScore > 70) return "bg-red-500";
    if (riskScore > 40) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="bg-white shadow rounded p-4">

      <h3 className="text-lg font-semibold mb-2">
        Inverter {inverterId}
      </h3>

      <div className={`text-white p-2 rounded ${getColor()}`}>
        Risk Score: {riskScore}%
      </div>
      

    </div>
  );
}

export default RiskCard;