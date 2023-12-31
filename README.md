## Demo

![Blog Page](image.png)

![Create Blog Post](image-1.png)

## Note

-   Auth0 usage
    -   withPageAuthRequired(), getSession(), [...auth0].js, handleAuth(), env
-   hostname for image src
    -   Set up images: {domain: <domain>} in next.config.js
-   pages structure
    -   api folder for service
    -   index.js for default page
-   dynamic route
    -   [id] for single param, [...id] for multiple params
-   api usage with openai
    -   api key in config
    -   old model vs gpt-3.5
-   set up page layout in component
    -   component/AppLayout
-   pass props in pages
    -   getServerSideProps(ctx)
-   tailwind
    -   @apply component for reusable button
    -   extend font family in tailwind.config.js
-   create utils to pass props to the layout
    -   return an object to store the props
-   stripe payment
    -   pages/api/webhooks
-   Cors from micro-cors (/api/webhooks/stripe.js)
    -   only allow post method and set-header
-   useCallback()
    -   only rerun the function if the dependencies change
-   Redisplay current post in the side page when the user refreshes the page
-   React context
    -   reducer, state, action
    -   provider, React.createContext()
