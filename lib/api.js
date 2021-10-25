const POST_GRAPHQL_FIELDS = `
        sys{
            id
        }
            title
            coverImage {
            url
        }
            date
            excerpt
            description {
            json
        }
`
async function fetchGraphQL(query, preview = false) {
    return fetch(
        `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
        {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${
            preview
                ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
                : process.env.CONTENTFUL_ACCESS_TOKEN
            }`,
        },
        body: JSON.stringify({ query }),
        }
    ).then((response) => response.json())
}

function extractPostEntries(fetchResponse) {
    return fetchResponse?.data?.titleCollection?.items
}

function extractPost(fetchResponse){
    return fetchResponse?.data?.title;
}

export async function getAllPostsForHome(preview) {
const entries = await fetchGraphQL(
    `query {
        titleCollection(order: date_DESC, preview: ${preview ? 'true' : 'false'}) {
        items {
        ${POST_GRAPHQL_FIELDS}
        }
    }
    }`,
    preview
)
return extractPostEntries(entries)
}

export async function getPostAndMorePosts(preview,postId){
    
    const entry = await fetchGraphQL(
        `query{
            title(id:"${postId}",preview:${preview ? true : false}){                
                ${POST_GRAPHQL_FIELDS}                
            }
        }`
    );

    const entries = await fetchGraphQL(
        `query{
            titleCollection(preview:${preview ? true : false}, limit:2){
                items{
                    ${POST_GRAPHQL_FIELDS}
                }
            }
        }`
    );

    const post = extractPost(entry);

    const relatedPosts = extractPostEntries(entries).filter((_post) => _post.sys.id !== post.sys.id);
    return {
        post,
        relatedPosts
    };
}