// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { FormField } from './form-field'
import React from 'react'

describe('FormField', () => {
  it('associates label with input', () => {
    render(
      <FormField
        label="Email"
        value=""
        onChange={vi.fn()}
      />
    )

    const label = screen.getByText('Email')
    const input = screen.getByLabelText('Email')

    expect(input).toBeDefined()
    expect(label.getAttribute('for')).toBe(input.id)
  })

  it('associates error with input', () => {
    render(
      <FormField
        label="Email"
        value=""
        onChange={vi.fn()}
        error="Invalid email"
      />
    )

    const input = screen.getByLabelText('Email')
    const error = screen.getByText('Invalid email')

    expect(input.getAttribute('aria-describedby')).toBe(error.id)
    expect(input.getAttribute('aria-invalid')).toBe('true')
  })
})
