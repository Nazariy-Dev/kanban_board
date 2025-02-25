import {IRouteData} from "../interfaces/IRouteData.ts";
import {IGithubIssue} from "../interfaces/IGitHubIssue.ts";
import {IIssue} from "../interfaces/IIssue.ts";

export function getRouteData(route: string): IRouteData {
    const baseURl = "https://github.com/"
    const routes = route.split('/');
    const routesLength = routes.length;

    const repoName = routes[routesLength - 1];
    const ownerName = routes[routesLength - 2];

    return {
        repo: {name: repoName, url: `${baseURl}${ownerName}/${repoName}`},
        owner: {name: ownerName, url: `${baseURl}${ownerName}/`},
    }
}

export function capitalizeFirstLetter(val: string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export function pagesRemaining(linkHeader?: string) {
    return !!(linkHeader && linkHeader.includes(`rel=\"next\"`));
}

export function rememberOrder(issues: IGithubIssue[], issueApiUrl: string) {
    const mappedIssues = issues.map((issue): IIssue => {
        return {
            id: issue.id,
            type: issue.state
        }
    })

    localStorage.setItem(issueApiUrl, JSON.stringify(mappedIssues));
}

export function restoreOrder(issues: IGithubIssue[], localStorageIssues: IIssue[]): IGithubIssue[] {
    localStorageIssues.forEach((localStorageIssue, index) => {
        const issueToMove = issues.find(issue => issue.id === localStorageIssue.id);
        if (!issueToMove) return
        issueToMove.state = localStorageIssue.type;
        // remove issue
        issues = issues.filter((issue) => issue.id !== issueToMove.id)

        // add that issue back with new index and type
        issues.splice(index, 0, issueToMove);
    })

    return issues;

}
