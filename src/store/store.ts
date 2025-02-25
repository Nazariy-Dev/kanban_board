import {create} from "zustand";
import {Octokit} from "octokit";
import {IGithubIssue} from "../interfaces/IGitHubIssue.ts";
import {IGitHubRepository} from "../interfaces/IGitHubRepository.ts"
import {pagesRemaining} from "../lib/functions.ts";

const octokit = new Octokit()

interface IStoreState {
    issues: IGithubIssue[],
    fetchIssues: (owner: string, repo: string, page: number) => void,
    issuesHaveMorePages: boolean,
    issuesAreLoading: boolean,
    issuesError: string,
    issuesApiURL: string

    repo: IGitHubRepository | null,
    fetchRepo: (owner: string, repo: string) => void,
    repoIsLoading: boolean,
    repoError: string
}

const useStore = create<IStoreState>(
    (set) => ({
        issuesHaveMorePages: true,
        issues: [],
        issuesAreLoading: false,
        issuesError: "",

        repo: null,
        repoError: "",
        repoIsLoading: false,
        issuesApiURL: "",

        fetchIssues: async (owner: string, repo: string, page: number = 1) => {

            try {
                set((state) => {
                    return {...state, issuesAreLoading: true};
                })

                const apiURL = `GET /repos/${owner}/${repo}/issues?page=${page}&state=all`
                const issues = await octokit.request(apiURL);
                const haveMorePages = pagesRemaining(issues.headers.link)

                set((state) => {
                    return {...state, issues: issues.data, issuesAreLoading: false, issuesHaveMorePages: haveMorePages, issuesApiURL: apiURL, issuesError: ""} ;
                })
            } catch (error) {
                set((state) => {
                    return {...state, issuesError: error.message,issues: []};
                })
            }
        },

        fetchRepo: async (owner: string, repoName: string) => {
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
        }
    })
)

export default useStore
