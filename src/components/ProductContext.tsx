"use client";

import React, { createContext, useContext, useState } from "react";

interface ProductContextType {
    selectedImage: string | null;
    setSelectedImage: (image: string) => void;
    selectedVariantId: string | null;
    setSelectedVariantId: (id: string | null) => void;
}

const ProductContext = createContext<ProductContextType | null>(null);

export function ProductProvider({
    children,
    initialImage,
    initialVariantId = null,
}: {
    children: React.ReactNode;
    initialImage: string | null;
    initialVariantId?: string | null;
}) {
    const [selectedImage, setSelectedImage] = useState<string | null>(initialImage);
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(initialVariantId);

    return (
        <ProductContext.Provider value={{ selectedImage, setSelectedImage, selectedVariantId, setSelectedVariantId }}>
            {children}
        </ProductContext.Provider>
    );
}

export function useProductContext() {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error("useProductContext must be used within a ProductProvider");
    }
    return context;
}
