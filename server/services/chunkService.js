export const splitIntoChunks = (
    text,
    chunkSize = 500,
    overlap = 100
) => {

    const words = text.split(/\s+/);

    const chunks = [];

    let start = 0;

    while (start < words.length) {

        const end = start + chunkSize;

        chunks.push(
            words.slice(start, end).join(" ")
        );

        start += (chunkSize - overlap);
    }

    return chunks;
};