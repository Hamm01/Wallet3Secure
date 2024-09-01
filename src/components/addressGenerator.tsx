import React, { useEffect, useRef } from "react";
import QRCode from "qrcode-generator";

interface QRaddress {
    address: string,
    size: number
}

export const AddressGenerator: React.FC<QRaddress> = ({ address, size }) => {
    const QrREF = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const qr = QRCode(4, 'L');
        qr.addData(address);
        qr.make();
        if (QrREF.current) {
            QrREF.current.innerHTML = qr.createImgTag();

            const img = QrREF.current.querySelector('img');
            if (img) {
                img.style.width = `${size}px`;
                img.style.height = `${size}px`;
            }
        }
    }, [address, size]);

    return <div ref={QrREF} />;
}
