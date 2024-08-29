import { Dribbble, Instagram, Twitch, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <section className="max-w-7xl mx-auto mt-8 p-4 border-t ">
            <div className="flex justify-between">
                <p className="text-primary text-xl tracking-tight">Developed By &nbsp;
                    <a href="https://github.com/hamm01" className='emotional_Rescue text-md'>Himanish </a>
                </p>
                <div className="icons flex gap-2">
                    <a href="https://dribble.com"><Dribbble /> </a >
                    <a href="https://instagram.com"><Instagram /> </a >
                    <a href="https://twitch.com"><Twitch /> </a >
                    <a href="https://twitter.com"><Twitter /> </a >
                </div>
            </div>
        </section>
    )
}
