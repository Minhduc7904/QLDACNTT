import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components";

const StudentPageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            {children}
        </div>
    );
};

export default StudentPageLayout;