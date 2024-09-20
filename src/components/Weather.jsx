import React from 'react';
import "./Weather.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'


export default function Weather() {
  return (
    <div className='weather'>
        <div className='search-bar'>
            <input type='text' placeholder='Search' />
            <p><FontAwesomeIcon icon={faMagnifyingGlass} /></p>
        </div>
    </div>
  )
}
