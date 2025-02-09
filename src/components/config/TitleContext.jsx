import React, { createContext, useContext, useState } from "react";

// Buat konteks
const TitleContext = createContext();

// Buat penyedia konteks
export const TitleProvider = ({ children }) => {
  const [title, setTitle] = useState("Japri Pay");
  const [subtitle, setSubtitle] = useState("PT Japri Pay Nusantara");

  const updateTitle = (newTitle) => setTitle(newTitle);
  const updateSubtitle = (newSubtitle) => setSubtitle(newSubtitle);

  return (
    <TitleContext.Provider value={{ title, subtitle, updateTitle, updateSubtitle }}>
      {children}
    </TitleContext.Provider>
  );
};

// Custom hook untuk menggunakan konteks
export const useTitleContext = () => useContext(TitleContext);
