const vectors = [];

export const storeEmbedding = async (id, text, embedding) => {
    vectors.push({
        id,
        text,
        embedding,
    });
};

function cosineSimilarity(a, b) {
    let dot = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        magA += a[i] * a[i];
        magB += b[i] * b[i];
    }

    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

export const searchEmbedding = async (queryEmbedding) => {
    const results = vectors
        .map((v) => ({
            text: v.text,
            score: cosineSimilarity(queryEmbedding, v.embedding),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    return results.map((r) => r.text);
};