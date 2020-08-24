import React from 'react';

import { Route, Redirect, Switch } from 'react-router-dom';

 

const ProtectedRoute = ({ component: Component, ...rest}) => {

 

    const appState = (localStorage.length !== 0 && !localStorage["appState"].isLoggedIn) ? JSON.parse(localStorage["appState"]) : null ;
console.log(appState);
    // const rolesAndPermissions = (appState && appState.user.rolesAndPermissions) ? appState.user.rolesAndPermissions : null ;

    // const userSpecificPermissions = (appState && appState.user.userSpecificPermissions) ? appState.user.userSpecificPermissions : null ;

    // const roles = (appState && appState.user.roles) ? appState.user.roles : null ;

    // const perform = rest.perform;

 

    return (

        <Route

            render={(props) => {

                if (!appState || !appState.isLoggedIn) {

                    return <Redirect to="/"/>

                } else if (appState.isLoggedIn) {//if (appState.isLoggedIn && !(rolesAndPermissions[roles[0]].static.includes(perform)) && (roles[0] !== 'Admin') && !(userSpecificPermissions.includes(perform)) ) {

                    return <Component {...props} />

                }

            }

            }

        />

    );

};

 

export default ProtectedRoute;