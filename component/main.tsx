'use client';

import { useEffect, useState } from 'react';

const priceUrl =
  'https://crix-api-endpoint.upbit.com/v1/crix/candles/minutes/1?code=CRIX.UPBIT.KRW-AHT&count=1';

const useAHTPrice = () => {
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true);
        const response = await fetch(priceUrl);
        if (!response.ok) {
          throw new Error('Error fetching data');
        }
        const data = await response.json();
        if (data && data.length > 0) {
          throw new Error('Unexcepted response');
        }

        setPrice(data[0].tradePrice);
      } catch (error) {
        console.error('Error:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, []);

  return price;
};

export const PerPriceType = (props: {
  type: 'Basic' | 'Premium';
  ahtPrice: number;
  initSubscriptionFee: number;
  initMonthlyReward: number;
}) => {
  const { type, ahtPrice, initMonthlyReward, initSubscriptionFee } = props;
  const [subscriptionFee, setSubscriptionFee] = useState(initSubscriptionFee);
  const [monthlyReward, setMonthlyReward] = useState(initMonthlyReward);

  const tax = subscriptionFee * 0.1;
  const monthlyRewareValue = monthlyReward * ahtPrice;
  const monthlyProfit = monthlyReward * ahtPrice - (subscriptionFee + tax);

  return (
    <div>
      {type}
      <div className="grid grid-cols-2">
        <div className="left text-right w-96 bg-slate-50">
          <div>구독료:</div>
          <div>부가세:</div>
          <div>월 보상 AHT:</div>
          <div>월 기대 수익:</div>
        </div>

        <div>
          <div>{subscriptionFee}원</div>
          <div>{tax}원</div>
          <div>{monthlyReward}개</div>
          <div>{monthlyProfit}원</div>
        </div>
      </div>
    </div>
  );
};

export const Main = () => {
  const price = useAHTPrice();

  const [basicPrice, setBasicPrice] = useState(5000);
  const [premiumPrice, setPremiumPrice] = useState(12000);

  return (
    <div>
      <div>아하 토큰(AHT) 1개 가격: {price}</div>
      <PerPriceType
        type="Premium"
        initMonthlyReward={4000}
        initSubscriptionFee={12000}
        ahtPrice={price}
      />
    </div>
  );
};
