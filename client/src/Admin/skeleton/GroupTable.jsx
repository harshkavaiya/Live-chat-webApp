import React from "react";

const GroupTable = () => {
  Array(5)
    .fill("")
    .map((_, i) => <div key={i} className="skeleton" />);
};

export default GroupTable;
