import { createTheme } from "@material-ui/core";

// declare module "@material-ui/core/styles/createBreakpoints" {
//     interface BreakpointOverrides {
//         xs: true; 
//         sm: true;
//         md: true;
//         lg: true;
//         xl: true;
//     }
// }

export const theme = createTheme({
    overrides: {
        MuiCssBaseline: {
            '@global': {
                body: {
                    fontFamily: 'Jost',
                    backgroundColor: 'white',
                    color: '#000000'
                },
            },
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 800,
            lg: 960,
            xl: 1280,
        },
    },
    typography: {
        fontFamily: 'Jost',
        h1: {
            fontFamily: 'Arsenal',
        },
        h2: {
            fontFamily: 'Arsenal',
        },
        h3: {
            fontFamily: 'Arsenal',
        }

    }
})