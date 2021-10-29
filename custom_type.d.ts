/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/naming-convention */

import { MuiPickersOverrides } from '@material-ui/pickers/typings/overrides';

type overridesNameToClassKey = {
    [P in keyof MuiPickersOverrides]: keyof MuiPickersOverrides[P];
};

type CustomType = {
    MuiPickersBasePicker: {
        pickerView: {
            maxWidth?: string;
        };
    };
    MuiPickersStaticWrapper: {
        container: {
            width: string;
            alignItems: string;
        };
        pickerView: {
            maxWidth: string;
            minWidth: string;
            minHeight: string;
        }
    }
};

declare module '@material-ui/core/styles/overrides' {
    interface ComponentNameToClassKey extends overridesNameToClassKey { }
    export interface ComponentNameToClassKey extends CustomType { }
}