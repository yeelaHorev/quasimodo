import { Button, Snackbar, Tooltip } from '@mui/material';
import { FC, useState } from 'react';
import "./Loading.scss";

interface CopyToClipboardProps {
    contentToCopy: string | (() => string);
    buttonText?: string;
}

export const Loading: FC<CopyToClipboardProps> = ({ contentToCopy, buttonText }) => {
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(true);
        navigator.clipboard.writeText(typeof contentToCopy === "function" ? contentToCopy() : contentToCopy);
    };

    const successText = "קישור לחדר הועתק ללוח"

    return (
        <>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "1vh" }}>
                <h1 style={{ margin: 0, marginRight: "1rem", color: "white" }}>waiting to another player</h1>
                <div className='loader'></div>
            </div>
            <Tooltip title="invite to game">
                <Button
                    sx={{
                        color: "#ff6b6b",
                        fontSize: "2.5rem",
                        fontWeight: "bold",
                        width: "30%",
                        ":hover": {
                            backgroundColor: "#ff6b6b",
                            color: "white",
                        }
                    }}
                    className='button-party'
                    onClick={handleClick}
                    variant='text'
                >
                    {buttonText}
                </Button>
            </Tooltip>
            <Snackbar
                open={open}
                onClose={() => setOpen(false)}
                autoHideDuration={2000}
                message={successText}
            />
        </>
    );
};
