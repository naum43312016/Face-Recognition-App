import React from 'react';
import './ImageLinkForm.css'

function ImageLinkForm({ onInputChange, onButtonSubmit }) {
    return (
        <div>
            <p className='f3'>
                {'This Magic Brain will detect faces in your pictures.'}
            </p>
            <div className='center'>
                <div className='pa4 center form br3 w-70 shadow-5'>
                    <input type='text' onChange={onInputChange}
                    className='image-input f4 pa2 w-70'/>
                    <button onClick={onButtonSubmit}
                    className='detect-btn w-30 grow f4 link  dib white bg-light-purple pointer'>Detect</button>
                </div>
            </div>
        </div>
    );
}
  
export default ImageLinkForm;
  