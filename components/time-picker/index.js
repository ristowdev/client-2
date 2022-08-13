import React from 'react'

import { TimePicker } from "@progress/kendo-react-dateinputs";



function TimePickerPro({  }) {
  const defaultValue = new Date(2000, 2, 10, 13, 30, 0);

  return (
     <>
             <TimePicker format="HH:mm:ss" defaultValue={defaultValue} />

        <div className='position-relative'>
            <div className='form-control input-height'>

            </div>
            <div className='box-picker-main'>
                <div className='box-picker-header'>
                    
                </div>
                <div className='box-picker-main-inside'>
                    <div className='single-inside-picker'>
                         
                        <div class='s-i-p-cell'>
                          <span>01</span>
                        </div>
                        <div class='s-i-p-cell'>
                          <span>02</span>
                        </div>
                        <div class='s-i-p-cell'>
                          <span>03</span>
                        </div>
                        <div class='s-i-p-cell'>
                          <span>04</span>
                        </div>
                        <div class='s-i-p-cell'>
                          <span>05</span>
                        </div>
                        <div class='s-i-p-cell'>
                          <span>06</span>
                        </div>
                        <div class='s-i-p-cell'>
                          <span>07</span>
                        </div>
                        <div class='s-i-p-cell'>
                          <span>08</span>
                        </div>
                        <div class='s-i-p-cell'>
                          <span>09</span>
                        </div>
                        <div class='s-i-p-cell'>
                          <span>10</span>
                        </div>
                        <div class='s-i-p-cell'>
                          <span>11</span>
                        </div>
                        <div class='s-i-p-cell'>
                          <span>12</span>
                        </div>
                        <div class='s-i-p-cell'>
                          <span>01</span>
                        </div>
                        <div class='s-i-p-cell'>
                          <span>02</span>
                        </div>
                        <div class='s-i-p-cell'>
                          <span>03</span>
                        </div>
                        <div class='s-i-p-cell'>
                          <span>04</span>
                        </div>
                        <div class='s-i-p-cell'>
                          <span>05</span>
                        </div>
                        <div class='s-i-p-cell'>
                          <span>06</span>
                        </div>
                        <div class='s-i-p-cell'>
                          <span>07</span>
                        </div>
                        <div class='s-i-p-cell'>
                          <span>08</span>
                        </div>
                        <div class='s-i-p-cell'>
                          <span>09</span>
                        </div>
                        <div class='s-i-p-cell'>
                          <span>10</span>
                        </div>
                        <div class='s-i-p-cell'>
                          <span>11</span>
                        </div>
                        <div class='s-i-p-cell'>
                          <span>12</span>
                        </div>
                        
                    </div>
                    {/* <div className='hour-picker'>

                    </div>
                    <div className='hour-picker'>

                    </div> */}
                </div>
                <div className='box-picker-footer'>
                    
                </div>
            </div>
        </div>
     </>
  )
}

export default TimePickerPro