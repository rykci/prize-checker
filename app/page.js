'use client'
import { Textarea } from '@mantine/core'
import { Button } from '@mantine/core'
import { useState } from 'react'

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
      <main className='grow flex flex-col items-center w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8'>
        <h1 className='text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center'>
          Manual Prize Checker
        </h1>
        {deckInfo.length == 0 ? (
          <div className='grow flex flex-col justify-center w-full max-w-2xl'>
            <Textarea
              className='mb-4 w-full'
              variant='filled'
              placeholder='Enter decklist'
              autosize
              minRows={2}
              maxRows={4}
              value={decklist}
              onChange={(e) => setDecklist(e.target.value)}
            />
            <Button onClick={handleImport} className='w-full py-3 text-lg'>
              Import
            </Button>
          </div>
        ) : (
          <div className='w-full mb-6'>
            <Button onClick={resetImport} className='w-full sm:w-auto px-8 py-3'>
              Reset
            </Button>
          </div>
        )}
        {deckInfo.length > 0 && (
          <>
            <div className='w-full mb-8'>
              <h2 className='text-xl sm:text-2xl font-semibold mb-4 text-center'>
                Prize Cards
              </h2>
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 max-w-2xl mx-auto'>
                {prizes.map((card, index) => (
                  <div
                    key={index}
                    className={`relative transition-all duration-200 ${
                      card.img != cardBack.img
                        ? 'hover:cursor-pointer hover:scale-105 hover:shadow-lg'
                        : ''
                    } ${card.prizeDrawn ? 'grayscale opacity-60' : ''}`}
                    onClick={() => handleRemovePrize(index)}
                  >
                    <img
                      src={card.img}
                      alt={card.img == cardBack.img ? 'Card back' : 'Prize card'}
                      className='w-full h-auto object-contain rounded-lg'
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className='w-full'>
              <h2 className='text-xl sm:text-2xl font-semibold mb-4 text-center'>
                Deck
              </h2>
              <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3'>
                {deckInfo.map((card) => (
                  <div
                    onClick={(e) => handlePrize(e, card.indexInDeck)}
                    key={card.indexInDeck}
                    className={`relative transition-all duration-200 ${
                      card.quantity > 0
                        ? 'hover:cursor-pointer hover:scale-105 hover:shadow-lg'
                        : 'grayscale opacity-50'
                    }`}
                  >
                    <img
                      src={card.img}
                      alt='Deck card'
                      className='w-full h-auto object-contain rounded-lg'
                    />
                    <div className='absolute left-1/2 transform -translate-x-1/2 bottom-1 sm:bottom-2 text-white font-bold bg-red-700 border-2 border-white rounded-full w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm text-center flex items-center justify-center shadow-lg'>
                      {card.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
      <footer className='text-center py-4 text-sm text-gray-600 dark:text-gray-400'>
        by rykci
      </footer>
    </div>
  )
}
