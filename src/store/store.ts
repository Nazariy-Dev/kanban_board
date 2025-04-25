import {create} from "zustand";
import {Octokit} from "octokit";
import {IGithubIssue} from "../interfaces/IGitHubIssue.ts";
import {IGitHubRepository} from "../interfaces/IGitHubRepository.ts"
import {pagesRemaining} from "../lib/functions.ts";
import {IRouteData} from "../interfaces/IRouteData.ts";

const octokit = new Octokit()

interface IStoreState {
    issues: IGithubIssue[],
    boardItems: IGithubIssue[],
    setBoardItems: (items: IGithubIssue[]) => void
    fetchIssues: (owner: string, repo: string, page: number) => void,
    issuesHaveMorePages: boolean,
    issuesAreLoading: boolean,
    issuesError: string,
    issuesApiURL: string

    repo: IGitHubRepository | null,
    fetchRepo: (owner: string, repo: string) => void,
    repoIsLoading: boolean,
    repoError: string,

    routeData: IRouteData,
    setRouteData: (data: IRouteData) => void,

    activeCard: number | null,
    setActiveCard: (cardNumber: number | null) => void
}

const useStore = create<IStoreState>(
    (set) => ({
        issuesHaveMorePages: true,
        issues: [],
        boardItems: [],
        issuesAreLoading: false,
        issuesError: "",

        repo: null,
        repoError: "",
        repoIsLoading: false,
        issuesApiURL: "",

        routeData: {
            owner: {
                name: "",
                url: ""
            },
            repo: {
                name: "",
                url: ""
            }
        },

        activeCard: 0,

        fetchIssues: async (owner, repo, page = 1) => {

            try {
                set((state) => {
                    return {...state, issuesAreLoading: true};
                })

                const apiURL = `GET /repos/${owner}/${repo}/issues?page=${page}&state=all`
                const issues = await octokit.request(apiURL);
                const haveMorePages = pagesRemaining(issues.headers.link)

                set((state) => {
                    return {
                        ...state,
                        issues: issues.data,
                        issuesAreLoading: false,
                        issuesHaveMorePages: haveMorePages,
                        issuesApiURL: apiURL,
                        issuesError: ""
                    };
                })
            } catch (error) {
                set((state) => {
                    return {...state, issuesError: error.message, issues: []};
                })
            }
        },

        fetchRepo: async (owner, repoName) => {
            try {
                set((state) => {
                    return {...state, repoIsLoading: true};
                })
                const repo = await octokit.request(`GET /repos/${owner}/${repoName}`);
                set((state) => {
                    return {...state, repo: repo.data, repoIsLoading: false};
                })
            } catch (error) {
                set((state) => {
                    return {...state, repoError: error.message};
                })
            }
        },
        setBoardItems: (updatedItems) => {
            // Compare if the new list is different from the previous list to prevent unnecessary re-renders
            set((state) => {
                if (JSON.stringify(state.boardItems) !== JSON.stringify(updatedItems)) {
                    return {...state, boardItems: updatedItems}
                } else {
                    return state
                }
            })
        },

        setRouteData: (data) => {
            set((state) => {
                return {
                    ...state, routeData: data
                }
            })
        },

        setActiveCard: (cardNumber) => {
            set((state)=> {
                return {
                    ...state,
                    activeCard: cardNumber
                }
            })
        }
    })
)

export default useStore
