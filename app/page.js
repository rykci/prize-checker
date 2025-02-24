'use client'
import Image from 'next/image'
import { Textarea } from '@mantine/core'
import { Button } from '@mantine/core'
import { useState } from 'react'
import { useEffect } from 'react'

export default function Home() {
  const cardBack = {
    img: '/card-back.png',
    prizeDrawn: false,
  }
  let [decklist, setDecklist] = useState('')
  let [deckInfo, setDeckInfo] = useState([])
  let [prizes, setPrizes] = useState([
    cardBack,
    cardBack,
    cardBack,
    cardBack,
    cardBack,
    cardBack,
  ])

  const resetImport = () => {
    setDeckInfo([])
    setPrizes([cardBack, cardBack, cardBack, cardBack, cardBack, cardBack])
  }

  const handleImport = () => {
    let rows = decklist.split('\n')

    rows = rows.filter((str) => /^[0-9]/.test(str))

    let deckImages = rows.map((row, indexInDeck) => {
      let words = row.split(' ')
      let quantity = words[0]
      let cardNumber = words[words.length - 1]
      let setSymbol = words[words.length - 2]

      cardNumber = cardNumber.padStart(3, '0')
      let img = `https://limitlesstcg.nyc3.digitaloceanspaces.com/tpci/${setSymbol}/${setSymbol}_${cardNumber}_R_EN.png`
      return {
        quantity,
        setSymbol,
        cardNumber,
        img,
        indexInDeck,
      }
    })

    setDeckInfo(deckImages)
    setPrizes([cardBack, cardBack, cardBack, cardBack, cardBack, cardBack])
  }

  const handlePrize = (e, cardIndex) => {
    // e.preventDefault()
    let card = deckInfo[cardIndex]
    let newDeckInfo = [...deckInfo]
    let newPrizes = prizes.filter((p) => p.img != cardBack.img)
    if (card.quantity > 0 && newPrizes.length < 6) {
      card.quantity -= 1

      newDeckInfo[cardIndex] = card
      newPrizes.push({ ...card, prizeDrawn: false })

      while (newPrizes.length < 6) {
        newPrizes.push(cardBack)
      }

      console.log(newPrizes)
      setDeckInfo(newDeckInfo)
      setPrizes(newPrizes)
    }
  }

  const handleRemovePrize = (index) => {
    if (prizes[index].img == cardBack.img) {
    } else {
      let newPrizes = [...prizes]
      let newDeckInfo = [...deckInfo]

      if (newPrizes[index].prizeDrawn) {
        let removedCard = newPrizes.splice(index, 1).pop()
        newDeckInfo[removedCard.indexInDeck].quantity++
        newPrizes.push(cardBack)
      } else {
        newPrizes[index].prizeDrawn = true
      }

      setDeckInfo(newDeckInfo)
      setPrizes(newPrizes)
    }
  }

  return (
    <div className='flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)]'>
      <main className='grow flex flex-col  items-center  min-w-screen'>
        <div>Manual Prize Checker</div>
        {deckInfo.length == 0 ? (
          <div className='grow flex flex-col justify-center w-2/5'>
            <Textarea
              className='pb-10 w-auto'
              variant='filled'
              placeholder='Enter decklist'
              autosize
              minRows={2}
              maxRows={4}
              value={decklist}
              onChange={(e) => setDecklist(e.target.value)}
            />
            <Button onClick={handleImport} className='w-screen p-16'>
              Import
            </Button>
          </div>
        ) : (
          <Button onClick={resetImport} className='w-screen p-16'>
            Reset
          </Button>
        )}
        <div className='deck sm:w-fit md:w-screen lg:w-1/2 grid grid-cols-3 gap-1 lg:p-16'>
          {deckInfo.length > 0 ? (
            prizes.map((card, index) => (
              <div
                key={index}
                className={`relative ${
                  card.img != cardBack.img ? 'hover:cursor-pointer' : ''
                } ${card.prizeDrawn ? 'grayscale' : ''}`}
                onClick={() => handleRemovePrize(index)}
              >
                <img src={card.img} />
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
        <div className='deck sm:w-fit md:w-screen lg:w-1/2 grid grid-cols-8 gap-1'>
          {deckInfo.length > 0 ? (
            deckInfo.map((card) => (
              <div
                onClick={(e) => handlePrize(e, card.indexInDeck)}
                key={card.indexInDeck}
                className={`relative ${
                  card.quantity > 0 ? 'hover:cursor-pointer' : 'grayscale'
                }`}
              >
                <img src={card.img} />
                <div className='absolute left-1/2 transform -translate-x-1/2 bottom-0 text-white font-semibold bg-red-800 border-2 rounded-full sm:w-8 sm:h-8 lg:w-8 lg:h-8 text-center flex items-center justify-center'>
                  {card.quantity}
                </div>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
      </main>
      <footer className=''>by rykci</footer>
    </div>
  )
}
