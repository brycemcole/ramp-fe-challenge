import { useCallback } from "react"
import { useCustomFetch } from "src/hooks/useCustomFetch"
import { SetTransactionApprovalParams } from "src/utils/types"
import { TransactionPane } from "./TransactionPane"
import { SetTransactionApprovalFunction, TransactionsComponent } from "./types"
import { useState } from "react"

export const Transactions: TransactionsComponent = ({ transactions }) => {
  const { fetchWithoutCache, loading, clearCache } = useCustomFetch()
  const updatedTransactions = useState<[string, boolean][] | null>(null)[0]

  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, newValue }) => {
      updatedTransactions?.push([transactionId, newValue])
      await fetchWithoutCache<void, SetTransactionApprovalParams>("setTransactionApproval", {
        transactionId,
        value: newValue,
      })
      await clearCache();
    },
    [fetchWithoutCache, clearCache]
  )

  if (transactions === null) {
    return <div className="RampLoading--container">Loading...</div>
  }

  return (
    <div data-testid="transaction-container">
      {transactions.map((transaction) => {
        return (
          <TransactionPane
            key={transaction.id}
            transaction={transaction}
            loading={loading}
            setTransactionApproval={setTransactionApproval}
          />
        )
      })}
    </div>
  )
}
