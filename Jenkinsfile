@Library('jenkins-shared-library@master') _

echo "Working on branch ${BRANCH_NAME}"
switch (BRANCH_NAME) {
    case 'develop':
        SLS_CD { }
        break
    case ~/^release\/.*$/:
        SLS_Hotfix { }
        break
    default:
        echo 'No matching Branch name.'
        break
}