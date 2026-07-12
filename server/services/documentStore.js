let documentText = "";

export const saveDocument = (text) => {
    documentText = text;
};

export const getDocument = () => {
    return documentText;
};