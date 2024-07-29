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
        if (!data && data.length < 1) {
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

  return {
    price,
    loading,
    error,
  }
};

const LeftCell = (props: { children: React.ReactNode }) => {
  return <div className="text-right p-1 text-lg w-32">{props.children}</div>;
}
const RightCell = (props: { children: React.ReactNode }) => {
  return <div className='text-right p-1 text-lg w-32'>{props.children}</div>;
}
const Row = (props: { children: React.ReactNode }) => {
  return (
    <div
      className="flex border-b-2 border-gray-700"
    >
      {props.children}
    </div>
  )

}

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
  const monthlyRewareValue = Math.floor(monthlyReward * ahtPrice)
  const monthlyProfit = Math.floor(monthlyReward * ahtPrice - (subscriptionFee + tax))
  
  let breakEvenPoint = (subscriptionFee + tax) / monthlyReward
  breakEvenPoint = Math.ceil(breakEvenPoint * 100) / 100  // 소수점 2자리까지 표시

  return (
    <div>
      <div className='text-xl'>{type} 멤버십</div>
      <div className="flex flex-col gap-1">
        <Row>
          <LeftCell>구독료 :</LeftCell>
          <RightCell>
            <input
              className='w-24 bg-slate-600 text-right pr-1 mr-1'
              value={subscriptionFee}
              onChange={(e) => setSubscriptionFee(Number(e.target.value))}
            />
            <span>원</span>
          </RightCell>
        </Row>
        <Row>
          <LeftCell>부가세 :</LeftCell>
          <RightCell>{tax} 원</RightCell>
        </Row>
        <Row>
          <LeftCell>월 보상 AHT :</LeftCell>
          <RightCell>
            <input
              className='w-24 bg-slate-600 text-right pr-1 mr-1'
              value={monthlyReward}
              onChange={(e) => setMonthlyReward(Number(e.target.value))}
            />
            <span>개</span>
            </RightCell>
        </Row>
        <Row>
          <LeftCell>월 보상 가치 :</LeftCell>
          <RightCell>{monthlyRewareValue} 원</RightCell>
        </Row>
        <Row>
          <LeftCell>월 기대 수익 :</LeftCell>
          <RightCell>{monthlyProfit} 원</RightCell>
        </Row>
        <Row>
          <LeftCell>손익 분기 점 :</LeftCell>
          <RightCell>{breakEvenPoint} 원</RightCell>
        </Row>
      </div>
    </div>
  );
};

export const Main = () => {
  const { price, error, loading } = useAHTPrice();

  const [ ahtPrice, setAhtPrice ] = useState('0');
  useEffect(() => {
    setAhtPrice(String(price));
  }, [price])
  
  if (loading) {
    return <div>로딩중...</div>;
  }
  
  return (
    <div>
      <div className='text-lg'>
        아하 토큰(AHT) 1개 가격:
        <input
          className='w-20 bg-slate-600 text-right pr-1 mr-1 ml-1'
          value={ahtPrice}
          onChange={(e) => setAhtPrice(e.target.value)}
        />원
      </div>
      {loading && <div>로딩중...</div>}

      <div className='h-16'></div>
      <PerPriceType
        type="Basic"
        initMonthlyReward={1800}
        initSubscriptionFee={5000}
        ahtPrice={Number(ahtPrice)}
      />

      <div className='h-16'></div>
      <PerPriceType
        type="Premium"
        initMonthlyReward={4000}
        initSubscriptionFee={12000}
        ahtPrice={Number(ahtPrice)}
      />

      <div className='h-16'></div>

    </div>
  );
};
