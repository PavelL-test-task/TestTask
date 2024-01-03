import React, { useState, useRef, useEffect } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useNavigate } from "react-router-dom";
import { Passwords } from "types";
import { Toast, ToastPropsData } from "components";
import { resetPassword } from "services";
import { RequireSession } from "components";

import styles from "./reset-password.module.css";

export const ResetPassword = (): JSX.Element => {
    const [passwords, setPasswords] = useState<Passwords>({
        oldPassword: "",
        newPassword: "",
    });
    const [errors, setErrors] = useState<Passwords>({
        oldPassword: "",
        newPassword: "",
    });
    
    const [working, setWorking] = useState<boolean>(false);
    const [toastProps, setToastProps] = useState<ToastPropsData | null>(null);
    const passwordsAC = useRef<AbortController | null>(null);
    const navigate = useNavigate();

    let gotoHomePage = "/user";

    useEffect(() => {
        return () => {
            if (passwordsAC.current) {
                passwordsAC.current.abort();
            }
        };
    }, []);

    const onSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();

        const currentErrors: Passwords = {
            oldPassword: "",
            newPassword: "",
        };

        if (!passwords?.oldPassword) {
            currentErrors.oldPassword = "Old password is required";
        }

        if (!passwords?.newPassword) {
            currentErrors.newPassword = "New password is required";
        }

        if (
            currentErrors.oldPassword ||
            currentErrors.newPassword
        ) {
            setErrors(currentErrors);
            return;
        }

        setWorking(true);

        const onSuccess = (): void => {
            setWorking(false);
            setToastProps({
                severity: "success",
                message: "Password reseted successfully",
                closeToast: () => {
                    setToastProps(null);
                },
            });
            navigate(gotoHomePage);

        };

        const onError = (error: string | undefined): void => {
            setWorking(false);
            setToastProps({
                severity: "error",
                message: error ?? "Unknown error",
                closeToast: () => {
                    setToastProps(null);
                },
            });
        };
        console.log(passwords)
        passwordsAC.current = resetPassword(passwords!, onSuccess, onError, onError);
    };

    return (
        <RequireSession>
            <div className={styles.container}>
                <div className={styles.topSpacer} />
                <Stack spacing={2} className={styles.contentStack}>
                    <Typography variant="h4" align="center">
                        Junior AI
                    </Typography>
                    <Typography variant="h5" align="center">
                        Reset passwords
                    </Typography>
                    {passwords && (
                        <form onSubmit={onSubmit}>
                            <Stack spacing={1}>
                                <TextField
                                    value={passwords.oldPassword}
                                    label="Old password *"
                                    error={errors.oldPassword ? true : false}
                                    helperText={errors.oldPassword || " "}
                                    InputProps={{
                                        readOnly: working,
                                    }}
                                    autoFocus
                                    onChange={(event) => {
                                        if (errors.oldPassword) {
                                            setErrors({ ...errors, oldPassword: "" });
                                        }
                                        setPasswords({
                                            ...passwords,
                                            oldPassword: event.target.value,
                                        });
                                    }}
                                />
                                <TextField
                                    value={passwords.newPassword}
                                    label="New password *"
                                    error={errors.newPassword ? true : false}
                                    helperText={errors.newPassword || " "}
                                    InputProps={{
                                        readOnly: working,
                                    }}
                                    onChange={(event) => {
                                        if (errors.newPassword) {
                                            setErrors({ ...errors, newPassword: "" });
                                        }
                                        setPasswords({
                                            ...passwords,
                                            newPassword: event.target.value,
                                        });
                                    }}
                                />
                                <div className={styles.centeredContent}>
                                    <Button
                                        color="secondary"
                                        variant="contained"
                                        type="submit"
                                        fullWidth={false}
                                        size="medium"
                                        disabled={working}
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </Stack>
                        </form>
                    )}
                </Stack>
                {toastProps ? <Toast data={toastProps} /> : null}
            </div>
        </RequireSession>
    );
};
