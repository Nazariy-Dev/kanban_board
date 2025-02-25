import {useEffect, useState, useCallback} from 'react'
import useStore from "../store/store.ts";
import Header from "../components/Header/Header.tsx";
import CanBanBoard from '../components/CanBanBoard.tsx';
import Links from "../components/Links.tsx";
import {IRouteData} from "../interfaces/IRouteData.ts";
import {Container, Heading, Spinner} from "@chakra-ui/react";
import {Outlet, useSearchParams} from "react-router-dom";
import Pagination from "../components/Pagination.tsx";
import {rememberOrder, restoreOrder} from "../lib/functions.ts";


function App() {
    const [routeData, setRouteData] = useState<IRouteData>()
    const issues = useStore(state => state.issues);
    const {
        issuesAreLoading,
        fetchIssues,
        issuesHaveMorePages: haveMorePages,
        issuesApiURL,
        issuesError
    } = useStore(state => state)
    const [searchParams] = useSearchParams()
    const currentPage = Number(searchParams.get("page")) || 1
    const [boardItems, setBoardItems] = useState(issues)
    const [activeCard, setActiveCard] = useState<number | null>(null)

    useEffect(() => {
        if (!routeData) return
        fetchIssues(routeData.owner.name, routeData.repo.name, currentPage)
    }, [currentPage, routeData]);

    useEffect(() => {
        const localStorageIssues = localStorage.getItem(issuesApiURL);
        let updatedIssues;
        if (!localStorageIssues) {
            updatedIssues = issues;
        } else {
            updatedIssues = restoreOrder(issues, JSON.parse(localStorageIssues));
        }

        setBoardItems(prevItems => {
            // Compare if the new list is different from the previous list to prevent unnecessary re-renders
            if (JSON.stringify(prevItems) === JSON.stringify(updatedIssues)) {
                return prevItems;
            }
            return updatedIssues; // Data has changed, update state
        });
    }, [issues]);

    const onDrop = useCallback((type: string, position: number) => {
        if (activeCard == null || activeCard === undefined) return;

        // set correct position
        if (activeCard! < position) {
            position--
        }
        const issueToMove = boardItems[activeCard];
        const updatedItems = boardItems.filter((_, index) => index !== activeCard)

        updatedItems.splice(position, 0, {
            ...issueToMove, state: type
        });

        setBoardItems(updatedItems)
        rememberOrder(updatedItems, issuesApiURL)
    }, [activeCard, boardItems, issuesApiURL])

    return (
        <Container py={6} position="relative">
            <Header setRouteData={setRouteData}/>
            {issuesAreLoading && !issuesError &&
                <Spinner position="absolute" top="40%" left={"50%"} translate="-50%, -50%" zIndex={10} mt={10} size="sm"
                         alignSelf="center"/>}

            {routeData && !issuesError ?
                <>
                    <Links routeData={routeData}/>
                    <Outlet context={{setActiveCard, onDrop, issues}}/>
                    <CanBanBoard setActiveCard={setActiveCard} onDrop={onDrop} items={boardItems}/>
                </> :
                !issuesError ? <Heading mt={10}>No issues yet, type repo URL above...</Heading> : ""
            }
            {issuesError && <Heading mt={10}>Repo with URL {routeData?.repo.url} is not found</Heading>}
            {(routeData || !haveMorePages) && !issuesError &&
                <Pagination currentPage={currentPage} haveMorePages={haveMorePages}></Pagination>}


        </Container>
    )
}

export default App
