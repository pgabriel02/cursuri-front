import Link from 'next/link'
import React from 'react'
import {FaEnvelope, FaFacebook, FaInstagram, FaTwitter} from 'react-icons/fa'
import { AiFillPhone } from 'react-icons/ai'

const Footer = () => {
    return(
        <footer className='bg-black px-10 lg:px-24 py-16 flex flex-wrap gap-5 absolute bottom-0 left-0 w-full'>
            <div className='flex flex-col gap-2 w-[80%] md:w-[30%]'>
                <h2 className='font-semibold text-white text-xl md:text-2xl'>Curs</h2>
                <div className='flex gap-2'>
                    <Link href='https://facebook.com'>
                        <a target='_blank' rel='noreferrer' >
                            <FaFacebook className='text-white text-xl hover:text-blue-500 duration-200 hover:scale-105' />
                        </a>
                    </Link>
                    <Link href='https://facebook.com'>
                        <a target='_blank' rel='noreferrer'>
                            <FaInstagram className='text-white text-xl hover:text-blue-500 duration-200 hover:scale-105' />
                        </a>
                    </Link>
                    <Link href='https://twitter.com'>
                        <a target='_blank' rel='noreferrer'>
                            <FaTwitter className='text-white text-xl hover:text-blue-500 duration-200 hover:scale-105' />
                        </a>
                    </Link>
                </div>
                <p className='text-white text-xl font-semibold mt-5'>Powered by <a className='duration-200 hover:text-blue-500' href='https://petregabriel.online' target='_blank'>Petre Gabriel</a></p>
            </div>
            <ul className='flex flex-col gap-2 w-[40%]'>
                <li className='text-white text-lg hover:text-blue-500 duration-200 font-medium'>
                    <Link href='/'>
                        Politica de confidentialitate
                    </Link>
                </li>
                <li className='text-white text-lg hover:text-blue-500 duration-200 font-medium'>
                    <Link href='/'>
                        Politica cookies
                    </Link>
                </li>
                <li className='text-white text-lg hover:text-blue-500 duration-200 font-medium'>
                    <Link href='/'>
                        Termeni și condiții
                    </Link>
                </li>
            </ul>
            <div className='flex flex-col gap-2'>
                <h3 className='text-white font-medium text-lg'>Contact</h3>
                <p className='text-white text-base flex items-center gap-2 group'><AiFillPhone className='group-hover:text-blue-500 duration-200' /> +40 123 123 123</p>
                <p className='text-white text-base flex items-center gap-2 group'><FaEnvelope className='group-hover:text-blue-500 duration-200' /> contact@curs.ro</p>
            </div>

        </footer>
    )
}

export default Footer