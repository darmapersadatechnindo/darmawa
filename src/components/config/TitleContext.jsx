import React, { createContext, useContext, useState } from "react";

// Buat konteks
const TitleContext = createContext();

// Buat penyedia konteks
export const TitleProvider = ({ children }) => {
  const [title, setTitle] = useState("Japri Pay");
  const [subtitle, setSubtitle] = useState("PT Japri Pay Nusantara");
  const [name,setName] = useState("")
  const [image,setImage] = useState("")
  const [userId,setUserId] = useState("")
  const updateTitle = (newTitle) => setTitle(newTitle);
  const updateSubtitle = (newSubtitle) => setSubtitle(newSubtitle);
  const updateName = (newName)=>setName(newName)
  const updateImage = (newName)=>setImage(newName)
  const updateUserId = (newUserId)=>setUserId(newUserId)
  return (
    <TitleContext.Provider value={{ title, subtitle,name,image,userId, updateTitle, updateSubtitle, updateName, updateImage,updateUserId }}>
      {children}
    </TitleContext.Provider>
  );
};

// Custom hook untuk menggunakan konteks
export const useTitleContext = () => useContext(TitleContext);
