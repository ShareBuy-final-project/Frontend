import { Redirect } from "expo-router";
import { useEffect } from "react";
import { deleteAllTokens } from "../utils/userTokens";

export default function Index() {
    useEffect(() => {
        // Clear the secure store when the app starts
        deleteAllTokens();
      }, []);
    return <Redirect href="/welcome" />;
}