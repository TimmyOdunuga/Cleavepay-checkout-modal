import React, { useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import fire from './account_widget/config/fbconfig';



const Plaid = () => {
  async function addbank(data) {
    return fetch('https://cleavepaytrail.firebaseapp.com/***',{
      method: 'POST',
      headers: {
        'Content-type':'application/json'
      }, 

      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
      console.log(res.message)
      // this.props.responseData = response.data 
    })
    .catch((error) => {
      console.log(error)
    })
 }

  const onSuccess = useCallback((token, metadata) => {

    let user = fire.auth().currentUser.uid;
  
    let data = {
      userId: user,
      public_token: token,
      accountName: metadata.account.name,
      account_id: metadata.account_id,
      bankName: metadata.institution.name,
      account_subtype: metadata.account.subtype
    } 

    addbank(data);



  }, 
    []
  );

  const config = {
    clientName: '*********',
    env: '*********',
    product: ['auth'],
    publicKey: '********************',
    language: 'en',
    linkCustomizationName: '*********',
    onSuccess,
    // ...
  };
  
  

  const { open, ready, error } = usePlaidLink(config);
  


  return (
    <div id={"addbank"} className={"plaidDiv"} onClick={() => open(Selection)} disabled={!ready}>
      <span>Add bank account</span>
    </div>
    
  );
};

export default Plaid;