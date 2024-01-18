"use client";

import { useState } from 'react';
import Image from 'next/image';
import { calculateCarRent, generateCarImageUrl } from '@/utils';
import { CarProps } from '@/types';
import CustomButton from './CustomButton';
import CarDetails from './CarDetails';
import { loadStripe } from "@stripe/stripe-js"; 

interface CarCardProps {
    car: CarProps;
}

const CarCard = ({ car }: CarCardProps) => {
    const { city_mpg, year, make, model, transmission, drive } = car;
    const [isOpen, setIsOpen] = useState(false)
    const carRent = calculateCarRent(city_mpg, year);

    let product = { 
        name: "Basalt Cars", 
        price: 1000, 
        productOwner: "Basalt", 
        description: "This beginner-friendly Cars Project.", 
        quantity: 1, 
    }

    const makePayment = async () => { 
        const stripe = await loadStripe("pk_test_51OZz1gSBlxIXFLghgYk6Bu50KMYdOryRPX7piXrPkcpngXDepTBtqAhSnqkoA20rKWCpe0Slufn2ZoXk0p7XTHb400bB2ctDW7y"); 
        const body = { product }; 
        const headers = { 
            "Content-Type": "application/json", 
        }; 
     
        const response = await fetch( 
            "http://localhost:3000/api/v1/create-checkout-session", { 
                method: "POST", 
                headers: headers, 
                body: JSON.stringify(body), 
            } 
        ); 
     
        const session = await response.json(); 
        console.log("======Session===",session);
        const result = stripe.redirectToCheckout({ 
            sessionId: session.id, 
        }); 
     
        if (result.error) { 
          console.log(result.error); 
        } 
    }; 

    return (
      <div className='car-card group'>
        <div className='car-card__content'>
            <h2 className='car-card__content-title'>
                {make} {model}
            </h2>
        </div>

        <p className='flex mt-6 text-[32px] leading-[38px]  font-extrabold'>
            <span className='self-start text-[14px] leading-[17px] font-semibold'>
                ₹
            </span>
            {carRent}
            <span className='self-end text-[14px] leading-[17px] font-semibold'>
                /day
            </span>
        </p>
        <p className='flex mt-6 text-[32px] leading-[38px]  font-extrabold'>
            <button
                type="button"
                className="custom-btn w-full py-[16px] rounded-full bg-primary-blue"
                onClick={makePayment}
            >
                <span className="flex-1 text-white text-[14px] leading-[17px] font-bold">Book Now </span>
                {(
                <div className='relative w-6 h-6'>
                    <Image
                    src="/right-arrow.svg"
                    alt='right icon'
                    fill
                    className='object-contain'
                    />
                </div>
                )}
            </button>
        </p>

        <div className='relative w-full h-40 my-3 object-contain'>
            <Image src={generateCarImageUrl(car)} alt='car-model' fill priority className='object-contain' />
        </div>

        <div className='relative flex w-full mt-2'>
            <div className='flex group-hover:invisible w-full justify-between text-gray'>
                <div className='flex flex-col justify-center items-center gap-2'>
                    <Image src='/steering-wheel.svg' width={20} height={20} alt='steering wheel'/>
                    <p className='text-[14px]  leading-[17px]'>
                        {transmission === 'a' ? 'Automatic' : 'Manual'}
                    </p>
                </div>
                <div className='flex flex-col justify-center items-center gap-2'>
                    <Image src='/tire.svg' width={20} height={20} alt='tyre'/>
                    <p className='text-[14px]'>
                        {drive.toUpperCase()}
                    </p>
                </div>
                <div className='flex flex-col justify-center items-center gap-2'>
                    <Image src='/gas.svg' width={20} height={20} alt='gas'/>
                    <p className='text-[14px]'>
                        {city_mpg} Kmpl
                    </p>
                </div>
            </div>

            <div className='car-card__btn-container'>
                <CustomButton
                title='View More'
                containerStyles='w-full py-[16px] rounded-full bg-primary-blue'
                textStyles="text-white text-[14px] leading-[17px] font-bold"
                rightIcon='/right-arrow.svg'
                handleClick={() => setIsOpen(true)}
                />
            </div>
        </div>
        <CarDetails isOpen={isOpen} closeModal={() => setIsOpen(false)} car={car} />
      </div>
    )
}

export default CarCard
